package com.orion.mdd_api.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "THEMES")
public class Theme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    private String description;

    @JsonIgnore
    @ManyToMany(mappedBy = "abonnements")
    private List<User> abonnes;

    @JsonIgnore
    @OneToMany(mappedBy = "theme", cascade = CascadeType.PERSIST)
    private List<Article> articles;

    @JsonIgnore
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @JsonIgnore
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @JsonProperty("abonnes")
    public List<Long> getAbonnesIds() {
        return abonnes.stream().map(User::getId).toList();
    }

    public void addArticle(Article article) {
        articles.add(article);
    }

    public String getTitre() {
        return titre;
    }
}
